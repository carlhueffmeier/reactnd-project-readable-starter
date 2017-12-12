// Fetches all categories and decides whether to render
// the category navigation component on this page

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCategories, getCategories } from 'redux/modules/categories';
import CategoryList from 'components/CategoryList';
import Spinner from 'components/Spinner';

class CategoryListContainer extends Component {
  componentDidMount() {
    this.props.fetchCategories();
  }

  getAllCategoryPaths() {
    return this.props.categories.map(category => `/${category.path}`);
  }

  isVisible() {
    const visibleLocations = [`/`, ...this.getAllCategoryPaths()];
    return visibleLocations.includes(this.props.location.pathname);
  }

  render() {
    const { isFetching, error } = this.props;

    if (!this.isVisible()) {
      return null;
    }

    if (isFetching) {
      return <Spinner />;
    }

    if (error) {
      return <span>{error}</span>;
    }

    return <CategoryList categories={this.props.categories} />;
  }
}

function mapStateToProps(state) {
  const { categories } = state.entities;
  return {
    categories: getCategories(state),
    isFetching: categories.isFetching,
    error: categories.error
  };
}

export default connect(mapStateToProps, { fetchCategories })(
  CategoryListContainer
);
