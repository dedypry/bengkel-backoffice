import { IService } from "./IService";
import { ISupplier } from "./ISupplier";
import { IWOItems, IWorkOrder } from "./IUser";

export interface IVendorTransaction {
  id: number;
  code: string;
  name: string;
  total_item: string;
}

export interface IVendorTrxDetail {
  supplier: ISupplier;
  wo: IWorkOrder;
  items: IWOItems<IService>[];
}
