module vote::Voting {
    use aptos_std::account;
    use std::vector;
    use std::string;
    use std::option;
    use std::address;

    /// A proposal with a description and a vote count
    struct Proposal has copy, drop, store {
        description: string::String,
        votes: u64,
    }

    /// Resource to store all proposals and who has voted
    struct VotingState has key {
        proposals: vector<Proposal>,
        voters: vector<address>,
    }

    /// Initialize the voting state with a list of proposals
    public entry fun init(account: &signer, descriptions: vector<string::String>) {
        // Build proposals vector inline
        account::create_resource_account(
            account,
            vector::empty<u8>(),
            VotingState {
                proposals: build_proposals(descriptions),
                voters: vector::empty<address>()
            }
        );
    }

    fun build_proposals(descriptions: vector<string::String>): vector<Proposal> {
        let proposals = vector::empty<Proposal>();
        let len = vector::length(&descriptions);
        let mut i = 0u64;
        while (i < len) {
            let desc_ref = vector::borrow(&descriptions, i);
            let desc = string::clone(desc_ref);
            vector::push_back(&mut proposals, Proposal { description: desc, votes: 0 });
            i = i + 1;
        }
        proposals
    }

    /// Vote for a proposal by index
    public entry fun vote(account: &signer, proposal_index: u64) acquires VotingState {
    let addr = signer::address_of(account);
    let state = borrow_global_mut<VotingState>(addr);
    // Prevent double voting
    let already_voted = contains(&state.voters, addr);
    assert!(!already_voted, 1);
    vector::push_back(&mut state.voters, addr);
    let proposal = vector::borrow_mut(&mut state.proposals, proposal_index);
    proposal.votes = proposal.votes + 1;
    }

    /// Get the number of votes for a proposal
    public fun get_votes(addr: address, proposal_index: u64): u64 acquires VotingState {
    let state = borrow_global<VotingState>(addr);
    let proposal = vector::borrow(&state.proposals, proposal_index);
    proposal.votes
    }

    /// Helper to check if an address is in the voters vector
    fun contains(voters: &vector<address>, addr: address): bool {
        let len = vector::length(voters);
        let mut i = 0;
        while (i < len) {
            if (*vector::borrow(voters, i) == addr) {
                return true;
            }
            i = i + 1;
        }
        false
    }
}
