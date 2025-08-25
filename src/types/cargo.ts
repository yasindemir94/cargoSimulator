export type CargoStatus =
  | "PREPARING"
  | "AT_BRANCH"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "DELIVERY_FAILED"
  | null;

export interface RawCargo {
  id: string;
  name: string;
  category: string;
  price: number;
  status: CargoStatus;
  kg: number | null;
  createdAt: number;
}

export interface CleanCargo extends Omit<RawCargo, "status" | "kg" | "price"> {
  status: Exclude<CargoStatus, null>;
  kg: number;
  price: number;
}
