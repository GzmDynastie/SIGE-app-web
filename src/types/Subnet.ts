export interface Subnet {
    id: number;
    vlan: number;
    initial_range: string;
    end_range: string;
    getway: string;
    description: string;
    number_of_ips: number;
    used_ports?: number;
  }
  