export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name?: string;
  role: 'survivor' | 'volunteer' | 'admin';
  phone?: string;
  is_verified?: boolean;
}

export interface Report {
  id: number;
  type_of_violence: string;
  description: string;
  location?: string;
  perpetrator_relation?: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  status: string;
  created_at: string;
}