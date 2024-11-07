type LocalStorageKey = "@library/token";

class LocalStorageKit {
  static set(key: LocalStorageKey, data: any) {
    if (typeof window !== "undefined") {
      console.log(`Setting token with key: ${key}`);
      let jsonData = typeof data === "string" ? data : JSON.stringify(data);
      localStorage.setItem(key, jsonData);
    }
  }

  static get(key: LocalStorageKey) {
    if (typeof window !== "undefined") {
      console.log(`Getting token with key: ${key}`);
      const jsonData = localStorage.getItem(key);
      try {
        if (!jsonData) {
          return null;
        }
        return JSON.parse(jsonData);
      } catch (error) {
        return jsonData;
      }
    }
    return null;
  }

  static remove(key: LocalStorageKey) {
    if (typeof window !== "undefined") {
      console.log(`Removing key: ${key}`);
      localStorage.removeItem(key);
      console.log(`Token after removal: ${localStorage.getItem(key)}`); // Kontrollera att token är borta
    }
  }
}

export default LocalStorageKit;

// type LocalStorageKey = "@library/token";

// class LocalStorageKit {
//   static set(key: LocalStorageKey, data: any) {
//     let jsonData = typeof data === "string" ? data : JSON.stringify(data);
//     localStorage.setItem(key, jsonData);
//   }

//   static get(key: LocalStorageKey) {
//     const jsonData = localStorage.getItem(key);
//     try {
//       if (!jsonData) {
//         return null;
//       }
//       return JSON.parse(jsonData);
//     } catch (error) {
//       return jsonData;
//     }
//   }

//   static remove(key: LocalStorageKey) {
//     localStorage.removeItem(key);
//   }
// }

// export default LocalStorageKit;
