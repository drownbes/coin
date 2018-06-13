export const filterStrToObject = filterStr => {
  switch (filterStr) {
    case "":
      return {};
    case "show_active":
      return {
        active: true
      };
    case "show_inactive":
      return {
        active: false
      };
    default:
      return {};
  }
};

export function isFiltered(filter, newUser) {
  return (filter === 'show_active' && !newUser.active) ||
    (filter === 'show_inactive' && newUser.active);
}

let id = 0;
let prefix = "mutation_";
export const uniqID = () => prefix + id++;


