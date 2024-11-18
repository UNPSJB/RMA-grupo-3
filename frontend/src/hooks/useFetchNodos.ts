import { useEffect, useState } from "react";
import axios from "axios";

interface NodoData {
    id: number;
    latitud: number;
    longitud: number;
    estado: boolean;
    ultimo_voltaje: number | null;
}

export const useFetchNodos = () => {
    const [data, setData] = useState<NodoData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/api/get-data");
                setData(response.data.data);
                setError(null);
            } catch (err) {
                setError("Error al cargar los datos");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};