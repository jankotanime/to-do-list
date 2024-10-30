// golang-backend/main.go
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// Struktura odpowiedzi JSON
type Message struct {
	Message string `json:"message"`
}

func suma(lista ...int) int {
	sum := 0
	for _, j := range lista {
		sum += j
	}
	return sum
}

// Handler dla endpointu "/api/message"
func messageHandler(w http.ResponseWriter, r *http.Request) {
	string := fmt.Sprintf("%d", suma(1, 2, 4, 6))
	response := Message{string}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func main() {
	http.HandleFunc("/api/message", messageHandler)
	http.ListenAndServe(":3000", nil) // Serwer uruchomi się na porcie 3000
}
