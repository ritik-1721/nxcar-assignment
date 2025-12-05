// src/types/api.ts

// ---------- Cities ----------
export interface City {
    city_id: string;
    city_name: string;
    state_id: string;
    district_name: string;
    group_cities: string | null;
    is_active: string;
    for_sell_form: string;
    city_order: string;
    created_date: string;
    city_image: string | null;
    v_cnt: string;
  }
  
  export interface CitiesResponse {
    status: string;
    data: City[];
  }
  
  // ---------- Cars ----------
  export interface Car {
    vehicle_id: string;
    vehicle_no: string;
    variant_id: string;
    variant: string;
    fuel_type: string;
    transmission: string;
    color: string;
    seats: string;
    year: string;
    mileage: string;
    vehicletype_id: string;
    ownership: string;
    price: string;
    emi: string;
    loan_amount: string;
    loan_tenure: string;
    location: string;
    rto_location: string;
    hidden_number_plate: string;
    status: string;
    expected_selling_price: string;
    car_additional_fuel: string;
    is_active: string;
    weight: string;
    seller_name: string;
    seller_address: string;
    created_date: string;
    updated_date: string;
    created_by: string;
    updated_by: string;
    updated_by_employee: string | null;
    add_to_carscope: string;
    make_id: string;
    model_id: string;
    make: string;
    model: string;
    is_luxury: string | null;
    state_id: string;
    city_id: string;
    city_name: string;
    seller_fullname: string;
    is_shortlisted: string;
    images: unknown; // null in sample
  }
  
  // ---------- Filters ----------
  export interface FilterPriceGroup {
    displayName: string;
    name: string;
    min: number;
    max: number | null;
    count: number;
  }
  
  export interface FilterRangeRaw {
    displayName: string;
    name: "price" | "year";
    type: "range";
    selected_min: string;
    selected_max: string;
    min: string;
    max: string;
    count: string;
    groups?: FilterPriceGroup[]; // only for price
  }
  
  export interface FilterModelOption {
    model_id: string;
    model: string;
    count: string;
  }
  
  export interface FilterMakeOption {
    make: string;
    make_id: string;
    count: number;
    models: FilterModelOption[];
  }
  
  export interface FilterMakeRaw {
    displayName: string;
    name: "make";
    type: "multiselect";
    options: FilterMakeOption[];
  }
  
  export type FilterRaw = FilterRangeRaw | FilterMakeRaw;
  
  // ---------- Pagination & Cars response ----------
  export interface CarsPagination {
    total: number;
    current_page: number;
    per_page: number;
    total_pages: number;
  }
  
  export interface CarsParams {
    city_list_count: number;
  }
  
  export interface CarsResponse {
    allcars: Car[];
    filters: FilterRaw[];
    params: CarsParams;
    pagination: CarsPagination;
  }
  