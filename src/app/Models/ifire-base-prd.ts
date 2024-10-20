export interface IfireBseProduct {
    brand: {
      name: string;
      slug: string;
      image: string;
      _id: string;
    };
    category: {
      slug: string;
      name: string;
      image: string;
      _id: string;
    };
    createdAt: string;
    description: string;
    id: string;
    imageCover: string;
    images: string[];
    price: number;
    priceAfterDiscount: number;
    quantity: number;
    ratingsAverage: number;
    ratingsQuantity: number;
    slug: string;
    sold: number;
    subcategory: any[];
    title: string;
    updatedAt: string;
  //   percentageDiscountAfterDiscount: number;
  // percentageDiscountOriginalPrice: number;
  }
