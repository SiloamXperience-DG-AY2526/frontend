type DemonymsResponseItem = {
  demonyms?: {
    eng?: {
      m?: string;
      f?: string;
    };
  };
};

type LanguagesResponseItem = {
  languages?: Record<string, string>;
};

type IddResponseItem = {
  idd?: {
    root?: string;
    suffixes?: string[];
  };
};

// Fetch nationalities
export async function fetchNationalities(): Promise<string[]> {
  try {
    const res = await fetch(
      'https://restcountries.com/v3.1/all?fields=demonyms'
    );
    if (!res.ok) return [];

    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];

    const nationalitySet = new Set<string>();

    (data as DemonymsResponseItem[]).forEach((c) => {
      const eng = c.demonyms?.eng;
      if (!eng) return;

      if (eng.m) nationalitySet.add(eng.m);
      if (eng.f) nationalitySet.add(eng.f);
    });

    return Array.from(nationalitySet).sort();
  } catch {
    return [];
  }
}

// Fetch languages
export async function fetchLanguages(): Promise<string[]> {
  try {
    const res = await fetch(
      'https://restcountries.com/v3.1/all?fields=languages'
    );
    if (!res.ok) return [];

    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];

    const langSet = new Set<string>();

    (data as LanguagesResponseItem[]).forEach((c) => {
      if (!c.languages) return;

      Object.values(c.languages).forEach((l) => {
        if (typeof l === 'string') langSet.add(l);
      });
    });

    return Array.from(langSet).sort();
  } catch {
    return [];
  }
}

// Fetch country calling codes
export async function fetchCountryCodes(): Promise<string[]> {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all?fields=idd');
    if (!res.ok) return [];

    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];

    const codes = new Set<string>();

    (data as IddResponseItem[]).forEach((c) => {
      const root = c.idd?.root;
      const suffixes = c.idd?.suffixes;
      if (!root || !Array.isArray(suffixes)) return;

      suffixes.forEach((s) => {
        codes.add(`${root}${s}`);
      });
    });

    return Array.from(codes).sort();
  } catch {
    return [];
  }
}
