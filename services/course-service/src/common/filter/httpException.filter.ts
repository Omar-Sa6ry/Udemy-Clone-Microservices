import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception);

    return new GraphQLError(exception.message, {
      extensions: {
        ...exception.extensions, // Preserve any existing GraphQL error extensions
        success: false, // Indicate that the operation failed
        statusCode: exception.extensions?.statusCode || 500, // Default to 500 if not provided
        timeStamp: new Date().toISOString().split('T')[0], // Add date for easier tracking
        code: exception.extensions?.code || 'INTERNAL_SERVER_ERROR', // Default error code
        // Remove fields that are not necessary or may expose sensitive data
        stacktrace: undefined,
        error: undefined,
        locations: undefined,
        path: undefined,
      },
    });
  }
}
