import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const App = () => {
    const [sum, setSum] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Pobieranie sumy z backendu Go
        axios.get('http://localhost:8080/api/sum')
            .then(response => {
                setSum(response.data.sum); // Ustawienie wyniku sumy
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <Text>Suma: {sum}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        color: 'white',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default App;
