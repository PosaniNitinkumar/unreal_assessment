// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract nUSD {
    string public name = "nUSD Stablecoin";
    string public symbol = "nUSD";
    uint8 public decimals = 18;
    
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    
    AggregatorV3Interface private ethUsdtPriceFeed;
    
    event Deposit(address indexed user, uint256 ethAmount, uint256 nusdAmount);
    event Redemption(address indexed user, uint256 nusdAmount, uint256 ethAmount);
    
    constructor() {
        ethUsdtPriceFeed = AggregatorV3Interface(0x779877A7B0D9E8603169DdbD7836e478b4624789); // Replace with actual contract address
    }
    
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than zero.");
        
        uint256 ethUsdtPrice = getETHUSDTPrice();
        uint256 nusdAmount = (msg.value * ethUsdtPrice) / (2*10**18);
        
        totalSupply += nusdAmount;
        balanceOf[msg.sender] += nusdAmount;
        
        emit Deposit(msg.sender, msg.value, nusdAmount);
    }
    
    function redeem(uint256 nusdAmount) external {
        require(nusdAmount > 0, "Redemption amount must be greater than zero.");
        require(balanceOf[msg.sender] >= nusdAmount, "Insufficient nUSD balance.");
        
        uint256 ethUsdtPrice = getETHUSDTPrice();
        uint256 ethAmount = (nusdAmount * (2*10**18)) / ethUsdtPrice;
        
        totalSupply -= nusdAmount;
        balanceOf[msg.sender] -= nusdAmount;
        
        (bool success, ) = msg.sender.call{value: ethAmount}("");
        require(success, "ETH transfer failed.");
        
        emit Redemption(msg.sender, nusdAmount, ethAmount);
    }
    
    function getETHUSDTPrice() public view returns (uint256) {
        (, int256 ethUsdtPrice, , , ) = ethUsdtPriceFeed.latestRoundData();
        return uint256(ethUsdtPrice);
    }
}
