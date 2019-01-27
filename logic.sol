pragma solidity ^0.5.1;
contract Banking {
    address owner;
    uint usersId;
    struct customer{
    address payable userAddress;
    string name;
    uint userId;
    bool created;
    uint totalAmount;
        }
    constructor() public {
        owner = msg.sender;
        }
    mapping(address=>customer) private accounts;
    event Deposits (address user, uint amount);
    event withdrawal(address user, uint amount);
    event transfer (address to, uint amount);
    
    function createAccount(string memory _name) public {
        require(!accounts[msg.sender].created);
        accounts[msg.sender].userAddress = msg.sender;
        accounts[msg.sender].name = _name;
        accounts[msg.sender].userId= usersId++;
        accounts[msg.sender].created = true;
    }
    function deposit(uint amount) public payable{
        require(msg.value==amount);
        require(accounts[msg.sender].created);
        accounts[msg.sender].totalAmount+= amount;
        emit Deposits(msg.sender, msg.value);
        }
    function transferFunds(address payable to , uint fundAmount) public {
            require(accounts[msg.sender].totalAmount>= fundAmount);
            require(accounts[to].created);
            to.transfer(fundAmount);
            accounts[msg.sender].totalAmount-=fundAmount;
        }
    function withdraw(uint amounts) public payable {
    require(accounts[msg.sender].totalAmount>=amounts);
    require(accounts[msg.sender].created);
    msg.sender.transfer(amounts);
    accounts[msg.sender].totalAmount-= amounts;
     emit withdrawal(msg.sender, msg.value);
       }
    modifier onlyOwner{
      require(msg.sender == owner);
      _;
       }
    function getBalance() public onlyOwner view returns(uint) {
         return (address(this).balance);
        }
    function getMyAccountAddress() public view returns(address) {
        return (accounts[msg.sender].userAddress);
        }
        function getMyAccountId() public view returns(uint) {
        return (accounts[msg.sender].userId);
        }
        function getMyAccountBalance() public view returns(uint) {
        return (accounts[msg.sender].totalAmount);
        }
         function getMyAccountName() public view returns(string memory) {
        return (accounts[msg.sender].name);
         }
    }
