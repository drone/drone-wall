package main

import (
	"database/sql"
	"encoding/json"
	"flag"
	"github.com/GeertJohan/go.rice"
	. "github.com/drone/drone/pkg/model"
	_ "github.com/mattn/go-sqlite3"
	"github.com/russross/meddler"
	"html/template"
	"log"
	"net/http"
)

var (
	repos      = flag.String("repos", "", "Comma-delimited list of repos to watch")
	team       = flag.String("team", "", "Team slug to watch")
	port       = flag.String("port", ":8080", "")
	refresh    = flag.Int("refresh", 10, "Refresh interval")
	driver     = flag.String("driver", "sqlite3", "")
	datasource = flag.String("datasource", "drone.sqlite", "")

	wallTemplate *template.Template
)

// Wall display handler
func wall(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "text/html; charset=utf-8")

	err := wallTemplate.ExecuteTemplate(w, "_", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	return
}

// API endpoint for fetching the initial wall display data via AJAX
func wallData(w http.ResponseWriter, r *http.Request) {
	var commits []*RepoCommit
	var err error

	if *team != "" {
		log.Println("teams")
		// list of recent team commits
		commits, err = listTeamWallCommits()
	} else {
		log.Println("repos")
		// list of recent commits
		commits, err = listRepoWallCommits()
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)

	err = json.NewEncoder(w).Encode(commits)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	return
}

func setupStatic() {
	box := rice.MustFindBox("assets")
	http.Handle("/fonts/", http.FileServer(box.HTTPBox()))
	http.Handle("/css/", http.FileServer(box.HTTPBox()))
	http.Handle("/js/", http.FileServer(box.HTTPBox()))
}

func setupTemplate() {
	box := rice.MustFindBox("templates")

	// parse the wall display template and then add to the global map
	page, err := box.String("watcher.html")
	if err != nil {
		panic(err)
	}

	wallTemplate = template.Must(template.New("_").Parse(page))
}

func main() {
	flag.Parse()

	setupStatic()
	setupTemplate()

	meddler.Default = meddler.SQLite

	var err error
	db, err = sql.Open(*driver, *datasource)
	if err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/refresh", wallData)
	http.HandleFunc("/", wall)

	log.Fatal(http.ListenAndServe(*port, nil))
}
