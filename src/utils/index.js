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

let id = 0;
let prefix = "mutation_";
export const uniqID = () => prefix + id++;
