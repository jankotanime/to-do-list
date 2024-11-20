// golang-backend/main.go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

type Event struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Checked bool   `json:"checked"`
}

// type eventTask struct {
// 	ID       int       `json:"id"`
// 	Plot     string    `json:"plot"`
// 	Deadline time.Time `json:"deadline"`
// 	Done     bool      `json:"done"`
// 	Event    int       `json:"event"`
// }

// Struktura odpowiedzi JSON
type Message struct {
	Message string `json:"message"`
}

func addNewEventToDB(name string) error {
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
	// Zapytanie do wstawienia nowego zadania
	_, err = dbpool.Exec(context.Background(), "INSERT INTO events (name, checked) VALUES ($1, $2)", name, false)
	if err != nil {
		return fmt.Errorf("błąd podczas dodawania zadania: %v", err)
	} else {
		fmt.Println(name)
	}

	return nil
}

func getAllEventsFromDB() ([]Event, error) {
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
	rows, err := dbpool.Query(context.Background(), "SELECT id_event, name, checked FROM events")
	if err != nil {
		return nil, fmt.Errorf("błąd pobierania danych: %v", err)
	}
	defer rows.Close()

	// Przechowywanie wyników w tablicy
	var events []Event
	for rows.Next() {
		var event Event
		err := rows.Scan(&event.ID, &event.Name, &event.Checked)
		if err != nil {
			return nil, fmt.Errorf("błąd skanowania danych: %v", err)
		}
		events = append(events, event)
	}

	// Sprawdzanie, czy wystąpił błąd po iteracji
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("błąd przy iteracji wyników: %v", err)
	}

	return events, nil
}

// Handler dla endpointu "/api/message"
func messageHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		users, err := getAllUsersFromDB()
		if err == nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK) // Ustaw status 200 (OK)
			json.NewEncoder(w).Encode(users)
		} else {
			response := Message{"Błąd! " + err.Error()}
			fmt.Println(err)
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusInternalServerError) // Ustaw status 500 (Internal Server Error)
			json.NewEncoder(w).Encode(response)
		}
	} else if r.Method == "POST" {
		var requestData User
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Nie udało się odczytać danych", http.StatusBadRequest)
			return
		}
		err = json.Unmarshal(body, &requestData)
		if err != nil {
			http.Error(w, "Błąd przetwarzania danych", http.StatusBadRequest)
			return
		}
		if requestData.ID == -1 {
			err = addNewTaskToDB(requestData.Plot, requestData.Deadline, requestData.Repeat)
		} else {
			err = CheckTaskToDB(requestData.ID, requestData.Done)
		}
		if err != nil {
			http.Error(w, "Błąd podczas dodawania zadania do bazy", http.StatusInternalServerError)
			return
		}
		users, err := getAllUsersFromDB()
		if err == nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK) // Ustaw status 200 (OK)
			json.NewEncoder(w).Encode(users)
		} else {
			response := Message{"Błąd! " + err.Error()}
			fmt.Println(err)
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusInternalServerError) // Ustaw status 500 (Internal Server Error)
			json.NewEncoder(w).Encode(response)
		}
	}
}

func eventHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		events, err := getAllEventsFromDB()
		if err == nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK) // Ustaw status 200 (OK)
			json.NewEncoder(w).Encode(events)
		} else {
			response := Message{"Błąd! " + err.Error()}
			fmt.Println(err)
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusInternalServerError) // Ustaw status 500 (Internal Server Error)
			json.NewEncoder(w).Encode(response)
		}
	} else if r.Method == "POST" {
		var requestData Event
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Nie udało się odczytać danych", http.StatusBadRequest)
			return
		}
		err = json.Unmarshal(body, &requestData)
		if err != nil {
			http.Error(w, "Błąd przetwarzania danych", http.StatusBadRequest)
			return
		}
		err = addNewEventToDB(requestData.Name)
		if err != nil {
			http.Error(w, "Błąd podczas dodawania zadania do bazy", http.StatusInternalServerError)
			return
		}
		users, err := getAllUsersFromDB()
		if err == nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK) // Ustaw status 200 (OK)
			json.NewEncoder(w).Encode(users)
		} else {
			response := Message{"Błąd! " + err.Error()}
			fmt.Println(err)
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusInternalServerError) // Ustaw status 500 (Internal Server Error)
			json.NewEncoder(w).Encode(response)
		}
	}
}

func main() {
	http.HandleFunc("/api/message", messageHandler)
	http.HandleFunc("/api/event", eventHandler)

	fmt.Println("Serwer uruchomiony na porcie 3000")
	if err := http.ListenAndServe(":3000", nil); err != nil {
		fmt.Println("Błąd uruchamiania serwera:", err)
	}

}
