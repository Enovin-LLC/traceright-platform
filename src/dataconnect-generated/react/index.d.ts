import { AddNewProductData, AddNewProductVariables, GetProductByIdData, GetProductByIdVariables, ListProductsData, UpdateProductData, UpdateProductVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useAddNewProduct(options?: useDataConnectMutationOptions<AddNewProductData, FirebaseError, AddNewProductVariables>): UseDataConnectMutationResult<AddNewProductData, AddNewProductVariables>;
export function useAddNewProduct(dc: DataConnect, options?: useDataConnectMutationOptions<AddNewProductData, FirebaseError, AddNewProductVariables>): UseDataConnectMutationResult<AddNewProductData, AddNewProductVariables>;

export function useGetProductById(vars: GetProductByIdVariables, options?: useDataConnectQueryOptions<GetProductByIdData>): UseDataConnectQueryResult<GetProductByIdData, GetProductByIdVariables>;
export function useGetProductById(dc: DataConnect, vars: GetProductByIdVariables, options?: useDataConnectQueryOptions<GetProductByIdData>): UseDataConnectQueryResult<GetProductByIdData, GetProductByIdVariables>;

export function useListProducts(options?: useDataConnectQueryOptions<ListProductsData>): UseDataConnectQueryResult<ListProductsData, undefined>;
export function useListProducts(dc: DataConnect, options?: useDataConnectQueryOptions<ListProductsData>): UseDataConnectQueryResult<ListProductsData, undefined>;

export function useUpdateProduct(options?: useDataConnectMutationOptions<UpdateProductData, FirebaseError, UpdateProductVariables>): UseDataConnectMutationResult<UpdateProductData, UpdateProductVariables>;
export function useUpdateProduct(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateProductData, FirebaseError, UpdateProductVariables>): UseDataConnectMutationResult<UpdateProductData, UpdateProductVariables>;
