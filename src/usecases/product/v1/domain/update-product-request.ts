import Tag from "@entities/tag";

interface UpdateProductRequest {
  id: number;
  name: string;
  tag?: Tag;
}

export default UpdateProductRequest;
