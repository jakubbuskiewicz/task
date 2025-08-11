import { useState, useCallback, useRef } from "react";

type City = {
  name: string;
};

const useFetchCityCount = () => {
  const [count, setCount] = useState<number | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchCount = useCallback(async (letter: string) => {
    setError("");
    setLoading(true);

    const trimmed = letter.trim().toLowerCase();

    if (!trimmed) {
      setError("");
      return;
    }

    if (letter.length !== 1 || !/^[a-z]$/i.test(letter)) {
      setError("Enter exactly one letter (a-z)");
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`http://localhost:3000/api/v1/cities?letter=${letter}`, {
        signal: controller.signal,
      });
      const data = await res.json();
      if (res.ok) {
        setCount(data.count);
        setCities(data.cities || []);
      } else {
        setError(data.error || "Unknown error");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError("Could not connect to backend");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { count, cities, error, loading, fetchCount, setError };
};

export default useFetchCityCount;
