import React, { useEffect, useState, useCallback } from "react";
import profileApi from "../../api/profile/profileApi";

export function useProfile({ page, targetId, sortBy }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await profileApi.getProfile({ page, targetId, sortBy });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page, targetId, sortBy]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { data, error, loading, refetch: fetchProfile };
}
