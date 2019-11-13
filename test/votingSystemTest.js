
var ElectionContract = artifacts.require("ElectionContract");
const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');


contract('Flight Surety Tests', async (accounts) => {

    let contract;
    let owner = accounts[0];
    let account2 = accounts[1];

    beforeEach(async () => {
      contract = await ElectionContract.new({ from:owner });
    });

    afterEach(async () => {
      await contract.kill({ from:owner});
    });


     it(`Confirms caller is contract owner`, async () => {
       let contractOwner = await contract.isOwner();
       assert.equal(contractOwner, true, "Caller is not ContractOwner");
    });

    it(`Confirms caller is not the contract owner`, async() => {
      let contractOwner = await contract.isOwner({from:account2});
      assert.equal(contractOwner, false, "Caller is ContractOwner");
    });


    it('Allows owner to set registration access', async() => {
      await contract.setRegistrationAccess(true);
      let regBool = await contract.getRegistrationAccess.call();
      assert.equal(regBool, true, "Registration is not open");
    });


    it(`Allows any address to register a candidate`, async () => {

//    await contract.setRegistrationAccess(false);
//    await truffleAssert.reverts(contract._registerCandidate(account2,"Boris Johnson", "Tory"), "Registration period is closed");
    //await truffleAssert.reverts(contract._registerVoter("John Derry", 19), "Voting period is closed");

  /*    let numberOfCandidates = await contract.numberOfCandidates.call();
      assert.equal(numberOfCandidates, 0, "initial contract has 0 candidates");

      try {
          await contract._registerCandidate(account2,"Boris Johnson", "Tory", {from:account2});
        } catch(err) {
          console.log("Only Contract Owner can register candidates");
        }




      try {
          await contract._registerCandidate(account2,"Boris Johnson", "Tory", {from:owner});
      }   catch (err){
          console.log(err);
      }

          numberOfCandidates = await contract.numberOfCandidates.call();
          assert.equal(numberOfCandidates, 1, "Contract has 1 candidate");
    });

*/
  });



    it('Allows an address to register voter', async() => {

        await truffleAssert.reverts(contract._registerVoter("John Derry", 19), "Voting period is closed");
/*      let votingOpen = await contract.getVotingAccess.call();
      assert.equal(votingOpen, false, "Voter Registration open");
      await truffleAssert.reverts(contract._registerVoter("John Derry", 19), "Voting period is closed");

      try {
         await ccontract._registerVoter("John Derry", 18);
      }  catch(err) {
         console.log("Cannot Register Voter");
      }

      votingOpen = await contract.setVotingAccess(true,{from:owner});
      await truffleAssert.reverts(contract._registerVoter("John Derry", 1), "Voters must be over 18 to register");

      votingOpen = await contract.getVotingAccess.call();
      assert.equal(votingOpen, true, "Voter Registration closed");

      await contract._registerVoter("John Derry", 18, {from:owner});
*/
    });





  });
