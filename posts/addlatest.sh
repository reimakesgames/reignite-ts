# really sad when i have to rely to chatgpt to write this for me
# DO NOT RUN THIS SCRIPT IN YOUR LOCAL MACHINE, THIS IS MEANT TO BE RUN IN GITHUB ACTIONS

# Directory containing release files
release_dir="posts/releases/"

# Get the 5 most recent release files
recent_releases=($(ls "$release_dir" | grep -E '^[0-9]{3}\.md$' | sort -nr | head -n 5))

# Check if there are any release files
if [ ${#recent_releases[@]} -eq 0 ]; then
  echo "No recent releases found."
  exit 1
fi

# Get the highest numbered release file
highest_release="${recent_releases[0]}"

# Extract the release number (3 digits)
release_number="${highest_release%%.*}"

# Append text to index.md with a link to the latest release
latest_release_link="1. [Latest Release: ${release_number}](releases/${release_number}.html)"

# Append the link to the index.md file
index_file="posts/index.md"
echo -e "$latest_release_link" >> "$index_file"

# Output release links
echo "$latest_release_link"
for release in "${recent_releases[@]}"; do
  release_number="${release%%.*}"
  # skip if this is the latest release
  if [ "$release_number" = "${highest_release%%.*}" ]; then
    continue
  fi
  release_link="1. [Release: ${release_number}](releases/${release_number}.html)"
  # Append the link to the index.md file
  echo -e "$release_link" >> "$index_file"
  echo "$release_link"
done

echo "Links added to $index_file"
