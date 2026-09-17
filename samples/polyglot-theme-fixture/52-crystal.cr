struct User
  getter name, roles

  def initialize(@name : String, @roles = [] of Symbol); end
end

puts User.new("Crystal", [:active]).name
