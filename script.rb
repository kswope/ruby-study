require 'pp'
require 'ap'


class MyClass

  attr_accessor :var

  def initialize(x)
    self.var = x
  end

  def <=>(other)
    self.var <=> other.var
  end

end

collection = [5,1,3,4,2].map {|x| MyClass.new(x)}
p collection.sort!
p collection.map {|c| c.var}

