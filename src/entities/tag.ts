import Product from "./product";

interface Tag {
  id?: number;
  name: string;
  products?: Product[]
}

export default Tag;
