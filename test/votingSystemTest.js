
var ElectionContract = artifacts.require("ElectionContract");
const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');


contract('Voting System Tests', async (accounts) => {

    let contract;
    let owner = accounts[0];
    let account2 = accounts[1];

    beforeEach(async () => {
      contract = await ElectionContract.new({ from:owner });
      await contract.setElectionAccess(true);
    });

    afterEach(async () => {
      await contract.kill({ from:owner});
    });


     it(`Confirms Caller is Contract owner`, async () => {
       /*Caller is contract Owner */
       let contractOwner = await contract.isOwner();
       assert.equal(contractOwner, true, "Caller is not ContractOwner");
    });

    it(`Confirms Caller is not the Contract owner`, async() => {
      /* Caller is not contract Owner */
      let contractOwner = await contract.isOwner({from:account2});
      assert.equal(contractOwner, false, "Caller is ContractOwner");
    });


    it('Allows Owner to set Registration access', async() => {
      /* Only Owner has access to set registration access */
      await contract.setRegistrationAccess(true);
      let regBool = await contract.getRegistrationAccess.call();
      assert.equal(regBool, true, "Registration is not open");
    });


    it(`Allows Contract Owner to Register a Candidate`, async () => {
      /* Only Owner has access to set registration access
      // Election period must be open
      // Registration period must be open */
      await contract.setRegistrationAccess(true);
      let numberOfCandidates = await contract.getNumberOfCandidates();
      assert.equal(numberOfCandidates, 0, "initial contract has 0 candidates");

      try {
          await contract._registerCandidate(account2,"John Smith", "Tory", {from:account2});
        } catch(err) {

        }
      try {
          await contract._registerCandidate(account2,"James Smith", "Tory", {from:owner});
      }   catch (err){
          // Only Owner has access to set registration access
      }
          numberOfCandidates = await contract.getNumberOfCandidates();
          console.log(numberOfCandidates.toNumber());
          // Candidate has succseefully been registered
          assert.equal(numberOfCandidates, 1, "Contract has 1 candidate");

          // Attemp to register a Candidate that is already registeredVoter
      try {
              await contract._registerCandidate(account2,"James Smith", "Tory", {from:owner});
          }   catch (err){
              // Owner has already registered as a candidate
              //console.log("Owner has already registered as a candidate");
          }
    });

      it('Allows any Address to Register voter', async() => {
        /* Only Owner has access to set registration voter
        // Election period must be open
        // Voting period must be open */
        let votingOpen = await contract.getVotingAccess.call();
        assert.equal(votingOpen, false, "Voter Registration open");
        // Voting period is open */
        try {
           await contract._registerVoter(owner, "John Derry", 18);
        }  catch(err) {
           // Voting period is closed //
        }
        votingOpen = await contract.setVotingAccess(true,{from:owner});
        // Voting period is open //
        votingOpen = await contract.getVotingAccess.call();
        assert.equal(votingOpen, true, "Voter Registration closed");
        await contract._registerVoter(owner, "John Derry", 18, {from:owner});
    });

      it('Allows a registered voter, to vote', async() => {
        // register voter, cast vote
        await contract.setVotingAccess(true);
        await contract._registerVoter(owner, "John Wayne", 34);
        let party = "Con";
        let voter = await contract.getVoter(0);
        let vote = await contract.vote("Con");
        let voteCount = await contract.getPartyCount(party);
        assert.equal(voteCount,1);

    });

      it(`Allows a registered Candidate to fund a party`, async() => {
        await contract.setRegistrationAccess(true);
        await contract._registerCandidate(owner,"James Smith", "Tory", {from:owner});
        await contract.fundPartyCampaign(owner,"Con",1);
        let amount = await contract.getPartyFund("Con");
        assert.equal(amount,1);
    });

      it(`Confirms getCandidate returns a registered candidate`, async() => {
        await contract.setRegistrationAccess(true);
        await contract._registerCandidate(owner,"James Smith", "Tory", {from:owner});
        await contract._registerCandidate(account2,"James Smith", "Tory", {from:owner});
        let getOwner = await contract.getCandidate(0);
        let candidate = await contract.getCandidate(1);
        let count = await contract.getNumberOfCandidates();
        assert.equal(owner,getOwner,"Registered candidate cannot be returned");
        assert.equal(candidate ,account2,"Registered candidate cannot be returned");
        assert.equal(count, 2, "Wrong number of registered candidates");
    });

});
