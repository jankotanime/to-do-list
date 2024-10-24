package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Endpoint do obliczeń sumy
	r.GET("/api/sum", func(c *gin.Context) {
		numbers := []int{1, 2, 3, 4, 5} // Przykładowe dane
		result := sum(numbers)
		c.JSON(http.StatusOK, gin.H{
			"sum": result,
		})
	})

	r.Run(":8080") // Uruchom serwer na porcie 8080
}
