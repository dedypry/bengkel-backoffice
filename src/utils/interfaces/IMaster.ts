export interface IMasterVehicle {
  type?: string;
  children: {
    id: number;
    type?: string;
    merk?: string;
    cc?: string;
    status?: string;
  }[];
}
