import { TimeStamp } from "../values/Timestamp";

export class User extends TimeStamp {
  id: number | null;
  username: string;
  first_name: string;
  last_name: string;
  born_date: string;
  email: string;
  gender: string;
  is_active: boolean;

  rol: string[];

  constructor(
    id: number | null, 
    username: string, 
    email: string, 
    first_name: string, 
    last_name: string, 
    born_date: string,
    gender: string,
    rol: string[], 
    is_active: boolean,
    created_at: Date | null = null,
    updated_at: Date | null = null,
    deleted_at: Date | null = null
  ) {
    super(created_at, updated_at, deleted_at);
    this.id = id;
    this.username = username;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.born_date = born_date;
    this.gender = gender;
    this.rol = rol;
    this.is_active = is_active;
  }
};