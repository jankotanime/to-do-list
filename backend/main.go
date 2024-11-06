// golang-backend/main.go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

// Struktura odpowiedzi JSON
type Message struct {
	Message string `json:"message"`
}

type User struct {
	ID       int       `json:"id"`
	Plot     string    `json:"plot"`
	Deadline time.Time `json:"deadline"`
	Done     bool      `json:"done"`
}

func getAllUsersFromDB() ([]User, error) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Błąd przy ładowaniu pliku .env")
	}
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	dbpool, err := pgxpool.New(context.Background(), dsn)
	if err != nil {
		log.Fatalf("Błąd połączenia z bazą danych: %v\n", err)
	}
	defer dbpool.Close()

	err = dbpool.Ping(context.Background())
	if err != nil {
		log.Fatalf("Błąd pingowania bazy danych: %v\n", err)
	}

	// Zapytanie do bazy danych
	rows, err := dbpool.Query(context.Background(), "SELECT id, plot, deadline, done FROM tasks")
	if err != nil {
		return nil, fmt.Errorf("błąd pobierania danych: %v", err)
	}
	defer rows.Close()

	// Przechowywanie wyników w tablicy
	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(&user.ID, &user.Plot, &user.Deadline, &user.Done)
		if err != nil {
			return nil, fmt.Errorf("błąd skanowania danych: %v", err)
		}
		users = append(users, user)
	}

	// Sprawdzanie, czy wystąpił błąd po iteracji
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("błąd przy iteracji wyników: %v", err)
	}

	return users, nil
}

// Handler dla endpointu "/api/message"
func messageHandler(w http.ResponseWriter, r *http.Request) {
	users, err := getAllUsersFromDB()
	if err == nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK) // Ustaw status 200 (OK)
		json.NewEncoder(w).Encode(users)
	} else {
		response := Message{"Błąd! " + err.Error()}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError) // Ustaw status 500 (Internal Server Error)
		json.NewEncoder(w).Encode(response)
	}
}

func main() {
	http.HandleFunc("/api/message", messageHandler)
	fmt.Println("Serwer uruchomiony na porcie 3000")
	if err := http.ListenAndServe(":3000", nil); err != nil {
		fmt.Println("Błąd uruchamiania serwera:", err)
	}

}
