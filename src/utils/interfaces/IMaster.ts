export interface IMasterVehicle {
  type?: string;
  children: IVehicleItem[];
}

export interface IVehicleItem {
  id: number;
  type?: string;
  merk?: string;
  cc?: string;
  status?: string;
}
