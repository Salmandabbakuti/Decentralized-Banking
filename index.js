 function log(message) {
    $('#log').append($('<p>').text(message));
    $('#log').scrollTop($('#log').prop('scrollHeight'));
  }
  function error(message) {
    $('#log').append($('<p>').addClass('dark-red').text(message));
    $('#log').scrollTop($('#log').prop('scrollHeight'));
  }
  function waitForReceipt(hash, cb) {
    web3.eth.getTransactionReceipt(hash, function (err, receipt) {
      if (err) {
        error(err);
      }
      if (receipt !== null) {
        // Transaction went through
        if (cb) {
          cb(receipt);
        }
      } else {
        // Try again in 1 second
        window.setTimeout(function () {
          waitForReceipt(hash, cb);
        }, 1000);
      }
    });
  }
  const address = "0xe4a7c317fe6029cbd24cfc59eca70643599d6047";
  const abi = [{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"createAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"amounts","type":"uint256"}],"name":"withdraw","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Deposits","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"withdrawal","type":"event"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyAccountAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyAccountBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyAccountId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyAccountName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}];
  $(function () {
    var banking;
    $('#getAccountDetails').click(function (e) {
      e.preventDefault();
      banking.getMyAccountName.call(function (err, result) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        $('#getName').text(result.toString());
      });
    });
    $('#getAccountDetails').click(function (e) {
      e.preventDefault();
      banking.getMyAccountAddress.call(function (err, result) {
        if (err) {
          return error(err);
        }
        // The return value is a BigNumber object
        $('#getAddress').text(result.toString());
      });
    });
    $('#getAccountDetails').click(function (e) {
      e.preventDefault();
      banking.getMyAccountId.call(function (err, result) {
        if (err) {
          return error(err);
        }
        // The return value is a BigNumber object
        $('#getId').text(result.toString());
      });
    });
    $('#getAccountDetails').click(function (e) {
      e.preventDefault();
      banking.getMyAccountBalance.call(function (err, result) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        $('#getBalance').text(result/(1000000000000000000)+" "+"ETH".toString());
      });
    });
     $('#createAccount').click(function (e) {
      e.preventDefault();
      if(web3.eth.defaultAccount === undefined) {
        return error("No accounts found. If you're using MetaMask, " +
                     "please unlock it first and reload the page.");
      }
      log("Transaction On its Way...");
      banking.createAccount.sendTransaction( document.getElementById("name").value, function (err, hash) {
        if (err) {
          return error(err);
        }
        waitForReceipt(hash, function () {
          log("Transaction succeeded.");
        });
      });
    });
    $('#withdraw').click(function (e) {
      e.preventDefault();
      if(web3.eth.defaultAccount === undefined) {
        return error("No accounts found. If you're using MetaMask, " +
                     "please unlock it first and reload the page.");
      }
      log("Transaction On its Way...");
      banking.withdraw.sendTransaction( document.getElementById("withdrawAmount").value, function (err, hash) {
        if (err) {
          return error(err);
        }
        waitForReceipt(hash, function () {
          log("Transaction succeeded.");
        });
      });
    });
    $('#deposit').click( function (e) {
      e.preventDefault();
       if(web3.eth.defaultAccount === undefined) {
        return error("No accounts found. If you're using MetaMask, " +
                     "please unlock it first and reload the page.");
      }
      log("Transaction On Its Way...");
      var bidTxObject = {
                    value: window.web3.toWei(document.getElementById("depositAmount").value, "ether"),
                  };
                  log( "Depositing Balance Into Your Account...")
                   
      banking.deposit.sendTransaction(bidTxObject, function (err, hash) {
        if (err) {
          return error(err);
        }
        waitForReceipt(hash, function () {
          log("Transaction succeeded.");
        });
      });
    });
    if (typeof(web3) === "undefined") {
      error("Unable to find web3. " +
            "Please run MetaMask (or something else that injects web3).");
    } else {
      log("Found injected web3.");
      web3 = new Web3(web3.currentProvider);
      ethereum.enable();
      if (web3.version.network != 3) {
        error("Wrong network detected. Please switch to the Ropsten test network.");
      } else {
        log("Connected to the Ropsten test network.");
        banking = web3.eth.contract(abi).at(address);
        $('#getAccountDetails').click();
        }
    }
  });
