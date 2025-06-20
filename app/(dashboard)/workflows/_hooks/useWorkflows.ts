"use client";

import { useQuery } from "@tanstack/react-query";

// Định nghĩa kiểu dữ liệu cho workflow nếu cần
type Workflow = {
  id: string;
  name: string;
  description?: string;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export function useWorkflows() {
  return useQuery<Workflow[]>({
    queryKey: ["workflows"],
    queryFn: async () => {
      try {
        const response = await fetch('/api/workflows');
        if (!response.ok) {
          throw new Error('Failed to fetch workflows');
        }
        const data = await response.json();
        return data.workflows;
      } catch (error) {
        console.error('Error fetching workflows:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60, // 1 phút
  });
} 