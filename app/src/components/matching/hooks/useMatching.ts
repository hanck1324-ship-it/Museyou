import { useState, useEffect } from 'react';
import { UserMatch } from '../MatchingCard';
import { Performance } from '../../performances/PerformanceCard';
import { matchingApi } from '../../../../lib/api/api';

interface UseMatchingProps {
  isLoggedIn: boolean;
  sampleMatches: UserMatch[];
}

export function useMatching({ isLoggedIn, sampleMatches }: UseMatchingProps) {
  const [matches, setMatches] = useState<UserMatch[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserMatch | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [proposalPerformance, setProposalPerformance] = useState<Performance | null>(null);
  const [proposalOpen, setProposalOpen] = useState(false);

  // Load matches
  const loadMatches = async () => {
    try {
      if (isLoggedIn) {
        const matchData = await matchingApi.getMatches();
        if (matchData.matches) {
          setMatches(matchData.matches);
        }
      } else {
        setMatches(sampleMatches);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
      setMatches(sampleMatches);
    }
  };

  // Open user profile
  const openProfile = (user: UserMatch) => {
    setSelectedUser(user);
    setProfileOpen(true);
  };

  // Close user profile
  const closeProfile = () => {
    setProfileOpen(false);
    setSelectedUser(null);
  };

  // Open date proposal
  const openProposal = (performance: Performance) => {
    setProposalPerformance(performance);
    setProposalOpen(true);
  };

  // Close date proposal
  const closeProposal = () => {
    setProposalOpen(false);
    setProposalPerformance(null);
  };

  return {
    // State
    matches,
    selectedUser,
    profileOpen,
    proposalPerformance,
    proposalOpen,
    
    // Actions
    setMatches,
    openProfile,
    closeProfile,
    openProposal,
    closeProposal,
    loadMatches,
  };
}


