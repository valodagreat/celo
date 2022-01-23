// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract MarketPlace {
    using SafeMath for uint;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    
    struct Product {
        address payable owner;
        string name;
        string image;
        string description;
        string category;
        uint price;
        uint sold;
        uint countinstock;
        uint timestamp;
    }

    Product[] products;

    function addProduct (
        string memory _name, 
        string memory _image, 
        string memory _description, 
        string memory _category, 
        uint _price, 
        uint _countinstock
    ) public {
        uint _sold = 0;
        products.push(Product(
            payable(msg.sender), 
            _name,
            _image, 
            _description, 
            _category, 
            _price, 
            _sold, 
            _countinstock, 
            block.timestamp
        ));
    }

    function getAProduct (uint _index) public view returns (
        address payable, 
        string memory, 
        string memory, 
        string memory, 
        string memory, 
        uint, 
        uint, 
        uint, 
        uint
    ){
        require(products.length > 0, "You don't have any product");
        Product storage productGotten = products[_index];
        return (
            productGotten.owner, 
			productGotten.name, 
			productGotten.image, 
			productGotten.description, 
			productGotten.category, 
			productGotten.price,
			productGotten.sold,
            productGotten.countinstock,
            productGotten.timestamp
            );
    }

    function getProducts () public view returns (Product[] memory){
        return products;
    }

    function buyProduct(uint _index) public payable  {
		require(
		  IERC20Token(cUsdTokenAddress).transferFrom(
			msg.sender,
			products[_index].owner,
			products[_index].price
		  ),
		  "Transfer failed."
		);
		products[_index].sold = products[_index].sold.add(1);
        products[_index].countinstock = products[_index].countinstock.sub(products[_index].sold);

	}
}