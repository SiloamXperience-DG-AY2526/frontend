// Fetch nationalities
export async function fetchNationalities(): Promise<string[]> {
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=demonyms"
    );

    if (!res.ok) {
      console.error("Failed to fetch nationalities");
      return [];
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Nationalities API did not return an array", data);
      return [];
    }

    const nationalitySet = new Set<string>();

    data.forEach((c: any) => {
      // Use 'eng' key for English demonyms
      if (c?.demonyms?.eng) {
        if (c.demonyms.eng.m) nationalitySet.add(c.demonyms.eng.m);
        if (c.demonyms.eng.f) nationalitySet.add(c.demonyms.eng.f);
      }
    });

    return Array.from(nationalitySet).sort();
  } catch (error) {
    console.error("Error fetching nationalities:", error);
    return [];
  }
}

// Fetch languages
export async function fetchLanguages(): Promise<string[]> {
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=languages"
    );

    if (!res.ok) {
      console.error("Failed to fetch languages");
      return [];
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Languages API did not return array", data);
      return [];
    }

    const langSet = new Set<string>();

    data.forEach((c: any) => {
      if (c?.languages && typeof c.languages === "object") {
        Object.values(c.languages).forEach((l) => {
          if (typeof l === "string") {
            langSet.add(l);
          }
        });
      }
    });

    return Array.from(langSet).sort();
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
}
// Fetch country calling codes
export async function fetchCountryCodes(): Promise<string[]> {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=idd");

    const data = await res.json();
    const codes = new Set<string>();

    data.forEach((c: any) => {
      if (c?.idd?.root && Array.isArray(c.idd.suffixes)) {
        c.idd.suffixes.forEach((s: string) => {
          codes.add(`${c.idd.root}${s}`);
        });
      }
    });

    return Array.from(codes).sort();
  } catch {
    return [];
  }
}
