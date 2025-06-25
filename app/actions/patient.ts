export type DataPoint = {
    id: number;
    x: number;
    y: number;
    name: string;
    dosage: number;
    frequency: string;
    isSquare: boolean;
    valueCheck: number;
    comment: string;
    hasComment?: boolean;
  };
  
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
  
  export async function fetchPatients(): Promise<DataPoint[]> {
    const res = await fetch(`${API_BASE}/todos/patients`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch patient data");
    return res.json();
  }
  
  export async function updatePatientComment(id: number, comment: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/todos/patients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    });
    return res.ok;
  }
  