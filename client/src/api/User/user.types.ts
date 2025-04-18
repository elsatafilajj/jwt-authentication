export interface User {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export interface UserRole {
  admin: {
    can: ["create", "edit", "delete", "view"];
  };
  editor: {
    can: ["create", "edit", "view"];
  };
  viewer: {
    can: ["create", "view"];
  };
}
