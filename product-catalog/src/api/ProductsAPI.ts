import axios from "axios";

type Params = {
  searchKey: string;
  page: number;
  perPage: number;
};
type SearchResult = {
  products: any[];
  lastPage: number;
};

const API_URL = "https://dummyjson.com/products/search";

function expandProducts(products: any[], target = 500) {
  const expanded: any[] = [];
  let id = 1;

  while (expanded.length < target) {
    for (const p of products) {
      if (expanded.length >= target) break;

      expanded.push({
        ...p,
        id: id++,
        title: `${p.title} #${id}`,
        price: Math.floor(p.price * (0.8 + Math.random() * 0.4)),
        rating: Math.min(5, Math.max(1, p.rating + (Math.random() - 0.5))),
      });
    }
  }

  return expanded;
}

export async function SearchProducts({ searchKey, page, perPage }: Params): Promise<SearchResult> {
  const skip = (page - 1) * perPage;

  const res = await axios.get(API_URL, {
    params: {
      q: searchKey || "a",
      limit: 100,
      skip: 0,
    },
  });

  const bigList = expandProducts(res.data.products, 500);
  const paged = bigList.slice(skip, skip + perPage);

  return {
    products: paged,
    lastPage: Math.ceil(bigList.length / perPage),
  };
}
