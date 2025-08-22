export type ProfileData = {
  email: string;
  roleId: number;
  nama: string;
  posisi: string;
  fotoUrl: string;
  noHp: string;
  password?: string;
};

export type RolesData = {
  id: number;
  roleName: string;
};

export type UserPickerData = {
  externalId: string;
  nama: string;
  roleName: string;
};
