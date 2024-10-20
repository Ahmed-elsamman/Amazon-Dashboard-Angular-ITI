import { Injectable } from '@angular/core';
import { Iproduct } from './../Models/iproduct';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  ProductsList: Iproduct[];

  constructor() {
    this.ProductsList = [
      { id: 2, name: "Anders Glass Top Coffee Table", price: 11200, quantity: 0, categoryID: 1, Material: "Glass", PrdimgURL: "https://media.homecentre.com/i/homecentre/165097472-165097472-HC21122022_01-2100.jpg?fmt=auto&$quality-standard$&sm=c&$prodimg-d-sqr-pdp-2x$", count: 0, details:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Totam fugit autem error, inventore exercitationem quidem. Minus, dolores quod architecto, esse omnis numquam maxime sapiente deleniti provident natus illo, est iste?" },
      { id: 5, name: 'Trixia 4-Seater Glass Top Table', price: 30000, quantity: 8, PrdimgURL: 'https://media.homecentre.com/i/homecentre/163645951-163645951-HC07102021_01-2100.jpg?fmt=auto&$quality-standard$&sm=c&$prodimg-d-sqr-pdp$', categoryID: 1, Material: 'Metal', count: 0, details:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Totam fugit autem error, inventore exercitationem quidem. Minus, dolores quod architecto, esse omnis numquam maxime sapiente deleniti provident natus illo, est iste?" },
      { id: 25, name: 'Gasha Marble Top Side Table', price: 14000, quantity: 10, PrdimgURL: 'https://media.homecentre.com/i/homecentre/160079085-160079085-HC020518_01-2100.jpg?fmt=auto&$quality-standard$&sm=c&$prodimg-d-sqr-pdp$', categoryID: 1, Material: 'Metal', count: 0, details:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Totam fugit autem error, inventore exercitationem quidem. Minus, dolores quod architecto, esse omnis numquam maxime sapiente deleniti provident natus illo, est iste?" },
      { id: 7, name: 'Ventura Fabric Dining Chair', price: 1500, quantity: 2, PrdimgURL: 'https://media.homecentre.com/i/homecentre/161257427-161257427-HC280119_01-2100.jpg?fmt=auto&$quality-standard$&sm=c&$prodimg-d-sqr-pdp$', categoryID: 2, Material: 'Upholstered Seating', count: 0, details:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Totam fugit autem error, inventore exercitationem quidem. Minus, dolores quod architecto, esse omnis numquam maxime sapiente deleniti provident natus illo, est iste?" },
      { id: 17, name: 'Alex Armless Study Chair', price: 2000, quantity: 2, PrdimgURL: 'https://media.homecentre.com/i/homecentre/160540419-160540419-HC020718_01-2100.jpg?fmt=auto&$quality-standard$&sm=c&$prodimg-d-sqr-pdp-2x$', categoryID: 2, Material: 'Fabric', count: 0, details:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Totam fugit autem error, inventore exercitationem quidem. Minus, dolores quod architecto, esse omnis numquam maxime sapiente deleniti provident natus illo, est iste?" },
      { id: 9, name: 'Boston Study Chair', price: 1000, quantity: 10, PrdimgURL: 'https://media.homecentre.com/i/homecentre/159671547-159671547-HCB1226OCT17_01-2100.jpg?fmt=auto&$quality-standard$&sm=c&$prodimg-d-sqr-pdp$', categoryID: 2, Material: 'Upholstered Seating', count: 0, details:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Totam fugit autem error, inventore exercitationem quidem. Minus, dolores quod architecto, esse omnis numquam maxime sapiente deleniti provident natus illo, est iste?" },
      { id: 10, name: 'Coby Extendable TV Unit', price: 13000, quantity: 0, PrdimgURL: 'https://media.homecentre.com/i/homecentre/163723189-163568026-HC16082021_01-2100.jpg?fmt=auto&$quality-standard$&sm=c&$prodimg-d-sqr-pdp$', categoryID: 3, Material: 'Wood', count: 0, details:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Totam fugit autem error, inventore exercitationem quidem. Minus, dolores quod architecto, esse omnis numquam maxime sapiente deleniti provident natus illo, est iste?" },
      { id: 15, name: 'Accent TV Unit', price: 36999, quantity: 4, PrdimgURL: 'https://media.homecentre.com/i/homecentre/161684469-161684469-HC210519_01-2100.jpg?fmt=auto&$quality-standard$&sm=c&$prodimg-d-sqr-pdp$', categoryID: 3, Material: 'MDF', count: 0, details:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Totam fugit autem error, inventore exercitationem quidem. Minus, dolores quod architecto, esse omnis numquam maxime sapiente deleniti provident natus illo, est iste?" },
      { id: 55, name: 'Plymouth TV Unit', price: 36999, quantity: 3, PrdimgURL: 'https://media.homecentre.com/i/homecentre/163688823-163688823-HC05102021_01-2100.jpg?fmt=auto&$quality-standard$&sm=c&$prodimg-d-sqr-pdp$', categoryID: 3, Material: 'wood', count: 0, details:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Totam fugit autem error, inventore exercitationem quidem. Minus, dolores quod architecto, esse omnis numquam maxime sapiente deleniti provident natus illo, est iste?" },
    ]
  }
  getAllProducts(): Iproduct[] {
    return this.ProductsList;
  }
  performSearch(filterName: string): Iproduct[] {
    filterName = filterName.toLowerCase();
    return this.ProductsList.filter((prd: Iproduct) => prd.name.toLowerCase().includes(filterName));
  }

  getProdByID(prdID:number): Iproduct | undefined {
    return this.ProductsList.find(prd=>prd.id==prdID);
  }

  getProdIDList ():number[]{
    return this.ProductsList.map(prd=>prd.id)
  }
}

//
