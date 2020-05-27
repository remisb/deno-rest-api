import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { Response } from "https://deno.land/x/oak/mod.ts";
import { Product } from "../types.ts";

let products: Product[] = [
  {
    id: "1",
    name: "Product One",
    description: "This is product one",
    price: 99.99,
  },
  {
    id: "2",
    name: "Product Two",
    description: "This is product two",
    price: 150.99,
  },
  {
    id: "3",
    name: "Product Three",
    description: "This is product three",
    price: 199.99,
  },
];

const successResponse = (
  response: Response,
  status: number,
  data: any,
): Response => {
  response.status = status;
  response.body = {
    success: true,
    data: data,
  };
  return response;
};

function errorResponse(
  response: Response,
  status: number,
  msg: string,
): Response {
  response.status = status;
  response.body = {
    success: false,
    msg: msg,
  };
  return response;
}

const getProducts = ({ response }: { response: Response }) => {
  return successResponse(response, 200, products);
};

const getProduct = (
  { params, response }: { params: { id: string }; response: Response },
) => {
  const product: Product | undefined = products.find((p) => p.id === params.id);

  if (!product) {
    return errorResponse(response, 404, "No product found");
  }

  return successResponse(response, 200, product);
};

const addProduct = async (
  { request, response }: { request: any; response: Response },
) => {
  const body = await request.body();

  if (!request.hasBody) {
    return errorResponse(response, 400, "No data");
  }

  const product: Product = body.value;
  product.id = v4.generate();
  products.push(product);

  return successResponse(response, 201, product);
};

const updateProduct = async (
  { params, request, response }: {
    params: { id: string };
    request: any;
    response: Response;
  },
) => {
  const product: Product | undefined = products.find((p) => p.id === params.id);

  if (!product) {
    return errorResponse(response, 404, "No product found");
  }

  const body = await request.body();
  const updateData: { name?: string; description?: string; price?: number } =
    body.value;

  products = products.map((p) =>
    p.id === params.id ? { ...p, ...updateData } : p
  );

  return successResponse(response, 200, products);
};

const deleteProduct = (
  { params, response }: { params: { id: string }; response: Response },
) => {
  products = products.filter((p) => p.id !== params.id);

  return successResponse(response, 204, "Product removed");
};

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct };
