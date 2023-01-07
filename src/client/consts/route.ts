export const Route = {
  home: "/",
  createTheme: "/themes/create",
  searchTheme: "/themes/search",
  createRepository: "/createRepository",
  themeDetail: (id: string) => `/themes/${id}`,
  me: "/users/me",
  deleteUser: "/users/delete",
} as const;
