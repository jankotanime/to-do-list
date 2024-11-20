package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

type User struct {
	ID       int       `json:"id"`
	Plot     string    `json:"plot"`
	Deadline time.Time `json:"deadline"`
	Done     bool      `json:"done"`
	Repeat   string    `json:"repeat"`
}

type RequestData struct {
	NewPlot string `json:"data"`
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
	rows, err := dbpool.Query(context.Background(), "SELECT id_task, plot, deadline, done, repeat FROM tasks")
	if err != nil {
		return nil, fmt.Errorf("błąd pobierania danych: %v", err)
	}
	defer rows.Close()

	// Przechowywanie wyników w tablicy
	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(&user.ID, &user.Plot, &user.Deadline, &user.Done, &user.Repeat)
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

// Funkcja do dodania nowego zadania do bazy danych
func addNewTaskToDB(plot string, deadline time.Time, repeat string) error {
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
	_, err = dbpool.Exec(context.Background(), "INSERT INTO tasks (plot, deadline, done, repeat) VALUES ($1, $2, $3, $4)", plot, deadline, false, repeat)
	if err != nil {
		return fmt.Errorf("błąd podczas dodawania zadania: %v", err)
	} else {
		fmt.Println(plot, deadline, repeat)
	}

	return nil
}

func CheckTaskToDB(id int, done bool) error {
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
	_, err = dbpool.Exec(context.Background(), "UPDATE tasks SET done=$2 WHERE id_task=$1", id, done)
	if err != nil {
		return fmt.Errorf("błąd podczas dodawania zadania: %v", err)
	}

	return nil
}
