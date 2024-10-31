// golang-backend/main.go
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

// Struktura odpowiedzi JSON
type Message struct {
	Message string `json:"message"`
}

func suma(x int) int {
	wynik := x * x
	return wynik
}

// Handler dla endpointu "/api/message"
func messageHandler(w http.ResponseWriter, r *http.Request) {
	xStr := r.URL.Query().Get("x")
	x, err := strconv.Atoi(xStr)
	if err == nil {
		string := fmt.Sprintf("%d", suma(x))
		response := Message{string}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	} else {
		response := Message{"błąd!"}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

func main() {
	http.HandleFunc("/api/message", messageHandler)
	http.ListenAndServe(":3000", nil)
}
