import { gql } from '@apollo/client';

export const GET_PERFORMANCES = gql`
  query GetPerformances($filters: PerformanceFilters) {
    performances(filters: $filters) {
      id
      title
      venue
      district
      category
      date
      price
      image
      description
    }
  }
`;

export const GET_PERFORMANCE_BY_ID = gql`
  query GetPerformanceById($id: ID!) {
    performance(id: $id) {
      id
      title
      venue
      district
      category
      date
      price
      image
      description
      reviews {
        id
        author
        rating
        comment
        createdAt
      }
    }
  }
`;


