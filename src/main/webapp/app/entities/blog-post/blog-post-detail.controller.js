(function () {
	'use strict';
	angular
		.module('acmeApp')
		.controller('BlogPostDetailController', BlogPostDetailController);

	BlogPostDetailController.$inject = ['$scope', '$rootScope', '$stateParams', '$sce', 'previousState', 'entity', 'BlogPost', 'User', 'Comment', 'AlertService'];

	function BlogPostDetailController($scope, $rootScope, $stateParams, $sce, previousState, entity, BlogPost, User, Comment, AlertService) {
		var vm = this;

		vm.blogPost = entity;
		vm.previousState = previousState.name;
		vm.addComment = addComment;

		vm.comments = {};

		loadAllComments();

		function loadAllComments() {
			Comment.query({
				postId: vm.blogPost.id
			}, function (data) {
				data.forEach(function(comment){
					console.log(comment.content);
					var htmlContent = comment.content.replace(/href='javascript:/g, "href='");
					comment.htmlContent = $sce.trustAsHtml(htmlContent);
				});
				vm.comments = data;
			}, function (error) {
				AlertService.error("Error loading comments");
			});
		}
		
		function sanitize(unsanitized, sanitized) {
			sanitized = sanitized || "";
			var sp = /(.*?)\[(b|i|url)\](.*?)\[\/\2\]((.|\n)*)/.exec(unsanitized);
			
			if (sp) {
				sanitized += sp[1].replace("<", "&lg;").replace(">", "&gt;");
				
				if (sp[2] === "url") {
					sanitized += "<a href='"+sp[3]+"'>"+sp[3]+"</a>";
				} else {
					sanitized += "<"+sp[2]+">"+sp[3]+"</"+sp[2]+">";
				}
				
				sanitized = sanitize(sp[4], sanitized);
			} else {
				sanitized += unsanitized.replace(/</g, "&lg;").replace(/>/g, "&gt;");
			}

			return sanitized;
		}

		var unsubscribe = $rootScope.$on('acmeApp:blogPostUpdate', function (event, result) {
			vm.blogPost = result;
		});

		$scope.$on('$destroy', unsubscribe);

		function addComment() {
			vm.isSaving = true;
			vm.comment.post = vm.blogPost;
			Comment.save(vm.comment, function (result) {
				$scope.$emit('acmeApp:commentUpdate', result);
				vm.isSaving = false;

				vm.comment = {};

				loadAllComments();

				$scope.commentForm.$setPristine();
				$scope.commentForm.$setUntouched();
			}, function (error) {
				AlertService.error("Error saving comment");
				vm.isSaving = false;
			});
		}
	}
})();
