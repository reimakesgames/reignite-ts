# look for this string in the files exported by jekyll
# /reignite-ts/assets/css
# and replace it with this string
# /reignite-ts/posts/assets/css

# loop through ./_site/posts
for file in ./_site/posts/*.html; do
	# replace the string
	sed -i 's/\/reignite-ts\/assets\/css/\/reignite-ts\/posts\/assets\/css/g' $file
done
