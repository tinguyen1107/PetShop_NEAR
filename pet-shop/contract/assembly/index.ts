import { Context, ContractPromiseBatch, logging, PersistentVector, storage, u128 } from 'near-sdk-as'

//Models

@nearBindgen
export class Pet {
    id: u16;
    owner: string;
    breed: string;
    age: u16;
    pic: string; //present as base64
    price: u128;

    constructor(
        _id: u16,
        _owner: string,
        _breed: string,
        _age: u16,
        _pic: string,
        _price: u128 
    ) {
        this.id = _id;
        this.owner = _owner;
        this.breed = _breed;
        this.age = _age;
        this.pic = _pic;
        this.price = _price;
    }
}

//Storage

const pets = new PersistentVector<Pet>('p');
const SERVICES_FEE = u128.from('1000000000000000000000000');
const contract_owner = 'tinnguyen.testnet';

//View methods

export function get_pets(): Array<Pet> {
    let return_pets:  Array<Pet> = [];

    for (let i = 0; i < pets.length; i++) {
        if (pets[i].price > u128.from('0')) {
            return_pets[i] = pets[i];
        }
    }
    return return_pets;
}

export function get_pets_by_owner(_owner: string): Array<Pet> {
    let return_pets: Array<Pet> = [];

    for (let i = 0; pets.length; i++) {
        if (pets[i].owner == _owner) {
            return_pets[i] = pets[i];
        }
    }
    return return_pets;
} 

//Modify methods

export function new_pets(
    _breed: string,
    _age: u16,
    _pic: string,
    _price: u128
): void  {
    let owner = Context.predecessor;
    let id = pets.length;
    let pet = new Pet(id, owner, _breed, _age, _pic, _price);
    pets.push(pet);
}

export function buy_a_pet(_id: u32) {
    let pet = pets[_id];
    let owner = pet.owner;
    let buyer = Context.predecessor;

    let amount = u128.sub(pet.price, SERVICES_FEE);

    ContractPromiseBatch.create(owner).transfer(amount);
    ContractPromiseBatch.create(contract_owner).transfer(SERVICES_FEE);
    
    //update owner
    pet.owner = buyer;
    pet.price = u128.Zero;
    pets[_id] = pet;
}

export function sell_a_pet(_id: u32, _price: string) {
    let pet = pets[_id];
    pet.price = u128.from(_price);
    pets[_id] = pet;
}

export function hide_my_pet_from_marketplace(_id: u32) {
    let pet = pets[_id];
    pet.price = u128.Zero;
    pets[_id] = pet;
}



