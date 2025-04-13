// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IERC20{
    // transfer tokens from caller's account to another account, returns True if transaction is success False otherwise
    function transfer(address receiver, uint256 amount) external returns (bool);

    // allows transfer from one account to another, returns True if transaction is success False otherwise
    function transferFrom(address sender, address receiver, uint256 amount) external returns (bool);

    // return the balance of the contract account
    function balanceOf(address account) external view returns (uint256);
}
contract DAI{
    // The owner of the contract(my MetaMask account)
    address public owner;
    IERC20 public daiToken;

    // Events for Deposit and Withdraw
    event Deposit(address indexed from, uint256 amount);
    event WithDraw(address indexed to, uint256 amount);

    // To restrict some function that only owner can use
    modifier onlyOwner(){
        require(msg.sender == owner, "Only owner can perform this operation");
        _;
    }

    // Only called when initialized
    // Set up the owner and the DAI token
    constructor(address _daiTokenAddress){
        owner = msg.sender;
        daiToken = IERC20(_daiTokenAddress);
    }

    /*
    // deposit the DAI tokens to account(Move DAI from a user's wallet to their contract)
    function deposit(uint256 amount) external{
        // the sender must approve to deposit DAI into their contract
        require(daiToken.transferFrom(msg.sender, address(this), amount), "DAI deposit failed");
        emit Deposit(msg.sender, amount);
    }
    */
    function depositFor(
      address user,
      uint256 amount,
      bytes calldata sig
    ) external {
      require( daiToken.transferFrom(user, address(this), amount), "DAI deposit failed");
      //daiToken.transferFrom(user, address(this), amount);
      
      emit Deposit(user, amount);
    }

    // writhdraw DAI from the contract to the owner's wallet
    function withdraw(uint256 amount) external onlyOwner(){
        // must have enough balance to withdraw
        require(daiToken.balanceOf(address(this)) >= amount, "Not eough balance to withdraw");
        // only owner can do this operation
        require(daiToken.transfer(owner, amount), "DAI withdraw failed");
        emit WithDraw(owner, amount);
    }
}